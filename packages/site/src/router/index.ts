import { createBrowserRouter, RouteObject } from 'react-router-dom'
import PageNotFound from '@/pages/404'
import Home from '@/pages/home'
import Demo from '@/pages/demo'

const routes: RouteObject[] = [
	{
		path: '/',
		Component: Home
	},
	{
		path: '/demo',
		Component: Demo
	},
	{
		path: '/*',
		Component: PageNotFound
	}
]

const router = createBrowserRouter(routes)

export default router
