import Profile from '@/components/page/Profile';
import { RouteObject } from 'react-router-dom';

const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    children: [
      { path: 'me', element: <Profile /> }
    ]
  }
];

export default profileRoutes;
