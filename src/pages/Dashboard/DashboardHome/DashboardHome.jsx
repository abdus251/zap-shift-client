import useUserRole from '../../../hooks/useUserRole'
import Loading from '../../../components/Loading'
import UserDashboard from './UserDashboard'
import AdminDashboard from './AdminDashboard'
import RiderDashboard from './RiderDashboard'
import Forbidden from '../../Forbid/Forbid'
const DashboardHome = () => {
  const { role, roleLoading } = useUserRole()

  if (roleLoading) {
    return <Loading></Loading>
  }

  if (role === 'user') {
    return <UserDashboard></UserDashboard>
  }

  if (role === 'admin') {
    return <AdminDashboard></AdminDashboard>
  }

  if (role === 'rider') {
    return <RiderDashboard></RiderDashboard>
  } else {
    return <Forbidden></Forbidden>
  }
}

export default DashboardHome
