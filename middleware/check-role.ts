export default defineNuxtRouteMiddleware((to, from) => {
    
    if(to.path.startsWith('/admin')) {
        const role = localStorage.getItem('role')
        if (role !== 'admin') {
            return navigateTo('/users')
        }
    }
});
