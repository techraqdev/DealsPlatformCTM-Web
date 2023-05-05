import { IMenu } from '../../../models/LayoutModels';

const Menuitems = [
  {
    title: 'Credentials DB',
    // icon: 'users',
    href: '/customers',
    collapse: true,
    children: [
      {
        title: 'Dashboard',
        //icon: 'list',
        href: '/db/dashboard',
      },
      {
        title: 'Projects',
        //icon: 'list',
        href: '/db/projects',
      },
      {
        title: 'Download',
        // icon: 'download',
        href: '/db/projects/downloads',
      },
    ],
  },

  {
    title: 'Administration',
    icon: 'admin',
    href: '/admin/users',
    collapse: true,
    children: [
      {
        title: 'Users',
        // icon: 'users',
        href: '/admin/users',
      },
    ],
  },
];

export default Menuitems;
