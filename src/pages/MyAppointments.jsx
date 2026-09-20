import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function MyAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    loadAppointments()
  }, [])

  async function loadAppointments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointments')
      .select('*, slots(*), doctor:doctor_id(full_name, specialty)')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setAppointments(data)
    setLoading(false)
  }

  async function cancelAppointment(appt) {
    setCancellingId(appt.id)
    setError('')

    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appt.id)

    if (updateError) {
      setError(updateError.message)
      setCancellingId(null)
      return
    }

    // free up the slot again
    if (appt.slot_id) {
      await supabase.from('slots').update({ is_booked: false }).eq('id', appt.slot_id)
    }

    await loadAppointments()
    setCancellingId(null)
  }

  if (loading) return <div className="page-loading">Loading your appointments...</div>

  return (
    <div className="dashboard">
      <h2>My Appointments</h2>
      {error && <div className="error-box">{error}</div>}

      {appointments.length === 0 ? (
        <div className="empty-state">You have no appointments yet. Go book one!</div>
      ) : (
        <ul className="appointment-list">
          {appointments.map((appt) => (
            <li key={appt.id} className={`appointment-item status-${appt.status}`}>
              <div>
                <strong>Dr. {appt.doctor?.full_name}</strong> — {appt.doctor?.specialty || 'General'}
                <div className="appt-meta">
                  {appt.slots?.slot_date} · {appt.slots?.start_time} - {appt.slots?.end_time}
                </div>
                {appt.notes && <div className="appt-notes">Note: {appt.notes}</div>}
                <span className={`status-badge status-${appt.status}`}>{appt.status}</span>
              </div>
              {appt.status === 'booked' && (
                <button className="danger-btn" onClick={() => cancelAppointment(appt)} disabled={cancellingId === appt.id}>
                  {cancellingId === appt.id ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
