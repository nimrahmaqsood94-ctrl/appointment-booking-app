import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [notes, setNotes] = useState('')
  const [bookingSlotId, setBookingSlotId] = useState(null)

  useEffect(() => {
    loadDoctors()
  }, [])

  async function loadDoctors() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
    if (error) setError(error.message)
    else setDoctors(data)
    setLoading(false)
  }

  async function loadSlots(doctor) {
    setSelectedDoctor(doctor)
    setSlotsLoading(true)
    setMessage('')
    setError('')
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('doctor_id', doctor.id)
      .eq('is_booked', false)
      .gte('slot_date', new Date().toISOString().split('T')[0])
      .order('slot_date', { ascending: true })
      .order('start_time', { ascending: true })
    if (error) setError(error.message)
    else setSlots(data)
    setSlotsLoading(false)
  }

  async function bookSlot(slot) {
    setBookingSlotId(slot.id)
    setError('')
    setMessage('')

    // Create the appointment
    const { error: apptError } = await supabase.from('appointments').insert({
      patient_id: user.id,
      doctor_id: selectedDoctor.id,
      slot_id: slot.id,
      notes,
      status: 'booked',
    })

    if (apptError) {
      setError('Booking failed: ' + apptError.message)
      setBookingSlotId(null)
      return
    }

    // Mark slot as booked
    const { error: slotError } = await supabase
      .from('slots')
      .update({ is_booked: true })
      .eq('id', slot.id)

    if (slotError) {
      setError('Appointment created but slot update failed: ' + slotError.message)
    } else {
      setMessage(`Appointment booked with Dr. ${selectedDoctor.full_name} on ${slot.slot_date} at ${slot.start_time}`)
      setNotes('')
      loadSlots(selectedDoctor)
    }
    setBookingSlotId(null)
  }

  if (loading) return <div className="page-loading">Loading doctors...</div>

  return (
    <div className="dashboard">
      <h2>Find a Doctor</h2>
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {doctors.length === 0 ? (
        <div className="empty-state">No doctors available yet.</div>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className={`doctor-card ${selectedDoctor?.id === doc.id ? 'active' : ''}`}
              onClick={() => loadSlots(doc)}
            >
              <h3>Dr. {doc.full_name}</h3>
              <p>{doc.specialty || 'General Practice'}</p>
            </div>
          ))}
        </div>
      )}

      {selectedDoctor && (
        <div className="slots-panel">
          <h3>Available Slots — Dr. {selectedDoctor.full_name}</h3>

          <label>Reason for visit (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Briefly describe your reason for visit" />

          {slotsLoading ? (
            <div className="page-loading">Loading slots...</div>
          ) : slots.length === 0 ? (
            <div className="empty-state">No available slots for this doctor right now.</div>
          ) : (
            <ul className="slot-list">
              {slots.map((slot) => (
                <li key={slot.id} className="slot-item">
                  <span>{slot.slot_date} · {slot.start_time} - {slot.end_time}</span>
                  <button onClick={() => bookSlot(slot)} disabled={bookingSlotId === slot.id}>
                    {bookingSlotId === slot.id ? 'Booking...' : 'Book'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
