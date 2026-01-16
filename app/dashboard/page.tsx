'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const STATUSES = ['todo', 'in_progress', 'done'] as const

type Status = 'todo' | 'in_progress' | 'done'

type Task = {
  id: string
  title: string
  status: Status
}

function Card({
  task,
  editingId,
  draftTitle,
  setEditingId,
  setDraftTitle,
  refreshTasks,
  deleteTask,
  statusColor,
}: {
  task: Task
  editingId: string | null
  draftTitle: string
  setEditingId: (id: string | null) => void
  setDraftTitle: (title: string) => void
  refreshTasks: () => Promise<void>
  deleteTask: (id: string) => void
  statusColor: { todo: string; in_progress: string; done: string }
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`rounded-xl p-3 ${statusColor[task.status]}`}
      style={{
        transform: CSS.Translate.toString(transform),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {editingId === task.id ? (
        <input
          autoFocus
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={async () => {
            await supabase
              .from('tasks')
              .update({ title: draftTitle })
              .eq('id', task.id)

            setEditingId(null)
            await refreshTasks()
          }}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await supabase
                .from('tasks')
                .update({ title: draftTitle })
                .eq('id', task.id)

              setEditingId(null)
              await refreshTasks()
            }
          }}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: 14,
          }}
        />
      ) : (
        <span
          onClick={() => {
            setEditingId(task.id)
            setDraftTitle(task.title)
          }}
          style={{ cursor: 'text', flex: 1 }}
        >
          {task.title}
        </span>
      )}

      <button
        onClick={() => deleteTask(task.id)}
        style={{
          opacity: 0.4,
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 14,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
        title="Delete"
      >
        ×
      </button>
    </div>
  )
}

function Column({
  status,
  tasks,
  editingId,
  draftTitle,
  setEditingId,
  setDraftTitle,
  refreshTasks,
  deleteTask,
  statusColor,
}: {
  status: Status
  tasks: Task[]
  editingId: string | null
  draftTitle: string
  setEditingId: (id: string | null) => void
  setDraftTitle: (title: string) => void
  refreshTasks: () => Promise<void>
  deleteTask: (id: string) => void
  statusColor: { todo: string; in_progress: string; done: string }
}) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div style={{ flex: 1 }}>
      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          borderRadius: 18,
          padding: 16,
          minHeight: 420,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {tasks.map((t) => (
          <Card
            key={t.id}
            task={t}
            editingId={editingId}
            draftTitle={draftTitle}
            setEditingId={setEditingId}
            setDraftTitle={setDraftTitle}
            refreshTasks={refreshTasks}
            deleteTask={deleteTask}
            statusColor={statusColor}
          />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          fetchTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })

    setTasks(data || [])
  }

  async function refreshTasks() {
    await fetchTasks()
  }

  async function addTask() {
    if (!newTask.trim()) return

    await supabase
      .from('tasks')
      .insert({
        title: newTask,
        status: 'todo',
      })
      .select()
      .single()

    setNewTask('')
    await refreshTasks()
  }

  async function deleteTask(id: string) {
    await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    await refreshTasks()
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const newStatus = over.id as Status

    await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', active.id)

    await refreshTasks()
  }

  const statusColor = {
    todo: 'bg-white/10',
    in_progress: 'bg-yellow-500/10',
    done: 'bg-green-500/10',
  }

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done'),
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div
        style={{
          maxWidth: 1280,
          margin: '64px auto',
          padding: '0 32px',
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <h1 className="text-3xl font-medium tracking-tight">
            Pryton
          </h1>
          <p className="text-sm text-white/50">
            Internal Kanban
          </p>
        </div>

        <div
          style={{
            marginBottom: 24,
            maxWidth: 420,
          }}
        >
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTask()
            }}
            placeholder="New task…"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              outline: 'none',
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
          <Column
            status="todo"
            tasks={tasksByStatus.todo}
            editingId={editingId}
            draftTitle={draftTitle}
            setEditingId={setEditingId}
            setDraftTitle={setDraftTitle}
            refreshTasks={refreshTasks}
            deleteTask={deleteTask}
            statusColor={statusColor}
          />
          <Column
            status="in_progress"
            tasks={tasksByStatus.in_progress}
            editingId={editingId}
            draftTitle={draftTitle}
            setEditingId={setEditingId}
            setDraftTitle={setDraftTitle}
            refreshTasks={refreshTasks}
            deleteTask={deleteTask}
            statusColor={statusColor}
          />
          <Column
            status="done"
            tasks={tasksByStatus.done}
            editingId={editingId}
            draftTitle={draftTitle}
            setEditingId={setEditingId}
            setDraftTitle={setDraftTitle}
            refreshTasks={refreshTasks}
            deleteTask={deleteTask}
            statusColor={statusColor}
          />
        </div>

      </div>
    </DndContext>
  )
}
