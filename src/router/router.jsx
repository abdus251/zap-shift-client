import { createBrowserRouter } from 'react-router'
import Home from '../pages/Home/Home/Home'
import RootLayout from '../layouts/RootLayout'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../pages/Authentication/Login/Login'
import Register from '../pages/Authentication/Register/Register'
import Coverage from '../pages/Coverage/Coverage'
import PrivateRoute from '../../src/routes/PrivateRoute'
import SendParcel from '../pages/SendParcel/SendParcel'
import DashboardLayout from '../layouts/DashboardLayout'
import MyParcels from '../pages/Dashboard/MyParcels/MyParcels'
import Payment from '../pages/Dashboard/MyParcels/Payment/Payment'
import PaymentHistory from '../pages/Dashboard/PaymentHistory/PaymentHistory'
import TrackParcel from '../pages/Dashboard/TrackParcel/TrackParcel'
import BeARider from '../pages/Dashboard/BeARider/BeARider'
import PendingRiders from '../pages/Dashboard/PendingRiders/PendingRiders'
import ActiveRiders from '../pages/Dashboard/ActiveRiders/ActiveRiders'
import MakeAdmin from '../pages/Dashboard/MakeAdmin/MakeAdmin'
import Forbidden from '../pages/forbidden/Forbidden'
import AdminRoute from '../routes/AdminRoute'
import AssignRider from '../pages/Dashboard/AssignRider/AssignRider'
import PendingDeliveries from '../pages/Dashboard/PendingDeliveries/PendingDeliveries'
import CompletedDeliveries from '../pages/Dashboard/CompletedDeliveries/CompletedDeliveries'
import MyEarnings from '../pages/Dashboard/MyEarnings'
import RiderRoute from '../routes/RiderRoute'
import DashboardHome from '../pages/Dashboard/DashboardHome/DashboardHome'
import AboutUs from '../pages/Dashboard/AboutUs'
import UpdateProfile from '../pages/Dashboard/UpdateProfile/UpdateProfile'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'coverage',
        Component: Coverage,
        loader: () => fetch('./serviceCenter.json'),
      },
      {
        path: 'forbidden',
        Component: Forbidden,
      },
      {
        path: 'about',
        Component: AboutUs,
      },
      {
        path: 'beARider',
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
        ),
        loader: () => fetch('./serviceCenter.json'),
      },
      {
        path: 'sendParcel',
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
        loader: () => fetch('./serviceCenter.json'),
      },
    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: 'myParcels',
        Component: MyParcels,
      },
      {
        path: 'payment/:parcelId',
        Component: Payment,
      },
      {
        path: 'paymentHistory',
        Component: PaymentHistory,
      },
      {
        path: 'track',
        Component: TrackParcel,
      },
      {
        path: 'updateProfile',
        Component: UpdateProfile,
      },
      // rider only routes
      {
        path: 'pendingDeliveries',
        element: <PendingDeliveries></PendingDeliveries>,
      },
      {
        path: 'completed-deliveries',
        element: <CompletedDeliveries></CompletedDeliveries>,
      },
      {
        path: 'my-earnings',
        element: (
          <RiderRoute>
            <MyEarnings></MyEarnings>
          </RiderRoute>
        ),
      },
      // admin only routes
      {
        path: 'assign-rider',
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },
      {
        path: 'pending-riders',
        element: (
          <AdminRoute>
            <PendingRiders></PendingRiders>
          </AdminRoute>
        ),
      },
      {
        path: 'active-riders',
        element: (
          <AdminRoute>
            <ActiveRiders></ActiveRiders>
          </AdminRoute>
        ),
      },
      {
        path: 'makeAdmin',
        element: (
          <AdminRoute>
            <MakeAdmin></MakeAdmin>
          </AdminRoute>
        ),
      },
    ],
  },
])
