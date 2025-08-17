// // ProtectedRoute.jsx
// const ProtectedRoute = ({ roles, redirectPath = '/login' }) => {
//   const token = localStorage.getItem('token');
//   const user = JSON.parse(localStorage.getItem('user')); // Asume que guardas datos del usuario

//   if (!token) {
//     return <Navigate to={redirectPath} replace />;
//   }

//   if (roles && !roles.includes(user?.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <Outlet />;
// };

// // Uso:
// {
//   element: <ProtectedRoute roles={['admin']} />,
//   children: [
//     {
//       path: "/admin",
//       element: <AdminPanel />,
//     },
//   ],
// }
import { Fade, Slide, JackInTheBox } from "react-awesome-reveal";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
