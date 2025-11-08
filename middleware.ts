
import { withAuth } from 'next-auth/middleware'
export default withAuth({ pages: { signIn: '/login' } })
export const config = { matcher: ['/admin/:path*','/me','/players/:path*','/trainings/:path*'] }
