import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [slotDate, setSlotDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [slots, setSlots] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [adding, setAdding] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    await Promise.all([loadSlots(), loadAppointments()])
    setLoading(false)
  }

  async function loadSlots() {
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('doctor_id', user.id)
      .order('slot_date', { ascending: true })
      .order('start_time', { ascending: true })
    if (error) setError(error.message)
    else setSlots(data)
  }

  async function loadAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, slots(*), patient:patient_id(full_name, phone)')
      .eq('doctor_id', user.id)
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setAppointments(data)
  }

  async function addSlot(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!slotDate || !startTime || !endTime) {
      setError('Please fill date, start time and end time.')
      return
    }
    if (startTime >= endTime) {
      setError('End time must be after start time.')
      return
    }

    setAdding(true)
    const { error: insertError } = await supabase.from('slots').insert({
      doctor_id: user.id,
      slot_date: slotDate,
      start_time: startTime,
      end_time: endTime,
    })
    setAdding(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setMessage('Slot added successfully.')
    setSlotDate('')
    setStartTime('')
    setEndTime('')
    loadSlots()
  }

  async function updateStatus(appt, status) {
    setUpdatingId(appt.id)
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appt.id)

    if (!updateError && status === 'cancelled' && appt.slot_id) {
      await supabase.from('slots').update({ is_booked: false }).eq('id', appt.slot_id)
    }

    if (updateError) setError(updateError.message)
    await loadAll()
    setUpdatingId(null)
  }

  if (loading) return <div className="page-loading">Loading dashboard...</div>

  return (
    <div className="dashboard">
      <h2>Doctor Dashboard</h2>
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      <div className="doctor-grid-2col">
        <div>
          <h3>Add Available Slot</h3>
          <form className="inline-form" onSubmit={addSlot}>
            <label>Date</label>
            <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />

            <label>Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

            <label>End Time</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <button type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add Slot'}</button>
          </form>

          <h3>Your Slots</h3>
          {slots.length === 0 ? (
            <div className="empty-state">No slots added yet.</div>
          ) : (
            <ul className="slot-list">
              {slots.map((slot) => (
                <li key={slot.id} className="slot-item">
                  <span>{slot.slot_date} · {slot.start_time} - {slot.end_time}</span>
                  <span className={`status-badge ${slot.is_booked ? 'status-cancelled' : 'status-booked'}`}>
                    {slot.is_booked ? 'Booked' : 'Free'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3>Incoming Appointments</h3>
          {appointments.length === 0 ? (
            <div className="empty-state">No appointments yet.</div>
          ) : (
            <ul className="appointment-list">
              {appointments.map((appt) => (
                <li key={appt.id} className={`appointment-item status-${appt.status}`}>
                  <div>
                    <strong>{appt.patient?.full_name}</strong>
                    <div className="appt-meta">
                      {appt.slots?.slot_date} · {appt.slots?.start_time} - {appt.slots?.end_time}
                    </div>
                    {appt.notes && <div className="appt-notes">Note: {appt.notes}</div>}
                    <span className={`status-badge status-${appt.status}`}>{appt.status}</span>
                  </div>
                  {appt.status === 'booked' && (
                    <div className="btn-row">
                      <button onClick={() => updateStatus(appt, 'completed')} disabled={updatingId === appt.id}>
                        Mark Complete
                      </button>
                      <button className="danger-btn" onClick={() => updateStatus(appt, 'cancelled')} disabled={updatingId === appt.id}>
                        Cancel
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
