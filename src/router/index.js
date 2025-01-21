import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import EmployeeDashboard from '../views/Employee/EmployeeDashboard.vue';
import AdminDashboard from '../views/Admin/AdminDashboard.vue';
import ManageEmployees from '../views/Admin/ManageEmployees.vue';
import ManageAttendance from '../views/Admin/ManageAttendance.vue';
import ManageLeave from '../views/Admin/ManageLeave.vue';
import ManageTraining from '../views/Admin/ManageTraining.vue';
import PersonalInfo from '../views/Employee/PersonalInfo.vue';
import SalaryView from "../views/Employee/Salary.vue";
import AttendanceRecord from "../views/Employee/AttendanceRecord.vue";
// import LeaveApplication from "../views/Employee/LeaveApplication.vue";
// import ResignationApplication from "../views/Employee/ResignationApplication.vue";
import TrainingActivity from "../views/Employee/TrainingActivity.vue";
import AvatarSetting from "../views/Employee/AvatarSetting.vue";
import LeaveResignationApplication from "../views/Employee/LeaveResignationApplication.vue"; // 引入新合并的页面

const employeeRoutes = {
  path: '/employee',
  component: EmployeeDashboard,
  meta: { requiresAuth: true, role: 'employee',employeeId: 'employeeId' },
  children: [
    { path: 'info', name: 'PersonalInfo', component: PersonalInfo },
    { path: 'salary', name: 'SalaryView', component: SalaryView },
    { path: 'attendance', name: 'AttendanceRecord', component: AttendanceRecord },
    { path: 'leave', name: 'LeaveResignationApplication', component: LeaveResignationApplication },  // 更新路由
    // { path: 'resignation', name: 'ResignationApplication', component: ResignationApplication },
    { path: 'training', name: 'TrainingActivity', component: TrainingActivity },
    { path: 'avatar', name: 'AvatarSetting', component: AvatarSetting },
  ]
};

const adminRoutes = [
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/manage-employees', name: 'ManageEmployees', component: ManageEmployees, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/manage-attendance', name: 'ManageAttendance', component: ManageAttendance, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/manage-leave', name: 'ManageLeave', component: ManageLeave, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/manage-training', name: 'ManageTraining', component: ManageTraining, meta: { requiresAuth: true, role: 'admin' } },
];

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  employeeRoutes,
  ...adminRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // 从 localStorage 中获取 token
  const role = localStorage.getItem('role'); // 从 localStorage 中获取角色

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 检查是否需要登录
    if (!token) {
      next('/login'); // 未登录，跳转到登录页面
    } else if (to.meta.role && to.meta.role !== role) {
      // 检查角色是否匹配
      next('/login'); // 角色不匹配，跳转到登录页面
    } else {
      next(); // 验证通过，继续访问
    }
  } else {
    next(); // 不需要登录的页面直接放行
  }
});

export default router;
