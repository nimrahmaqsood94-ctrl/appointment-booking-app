import { useAuth } from '../context/AuthContext'
import PatientDashboard from './PatientDashboard'
import DoctorDashboard from './DoctorDashboard'

export default function Dashboard() {
  const { profile, loading } = useAuth()

  if (loading) return <div className="page-loading">Loading...</div>
  if (!profile) return <div className="page-loading">Setting up your profile...</div>

  return profile.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />
}
