import { createBrowserRouter, RouteObject } from 'react-router-dom'
import PageNotFound from '@/pages/404'
import Home from '@/pages/home'

const routes: RouteObject[] = [
	{
		path: '/',
		Component: Home
	},
	{
		path: '/*',
		Component: PageNotFound
	}
]

const router = createBrowserRouter(routes)

export default router
