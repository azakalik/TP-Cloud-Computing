import {
   Group,
   Divider,
   Box,
   Burger,
   Drawer,
   ScrollArea,
   rem,
   Image
 } from '@mantine/core';
 import { useDisclosure } from '@mantine/hooks';
 import classes from '../css-modules/NavBar.module.css';
import { SignOutButton } from './SignInButton';
import { Link } from 'react-router-dom';
import { BalanceContainer } from './BalanceContainer';

type NavBarLink = {
  to: string;
  text: string;
};

const navBarLinks: NavBarLink[] = [
  { to: '/', text: 'Home' },
  { to: '/new_auction', text: 'Add an auction' },
  { to: '/about_us', text: 'About us' },
];

 
export function NavBar() {
   const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
   return (
     <Box>
       <header className={classes.header}>
         <Group justify="space-between" h="100%">
           <Image src="/logo.jpeg" alt="eZAuction" h={50}/>
 
           <Group h="100%" gap={0} visibleFrom="sm">
              {
                navBarLinks.map((link) => (
                  <Link to={link.to} className={classes.link}>{link.text}</Link>
                ))
              }
           </Group>

           <BalanceContainer />              
 
           <Group visibleFrom="sm">
             <SignOutButton />
           </Group>
 
           <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
         </Group>
       </header>
 
       <Drawer
         opened={drawerOpened}
         onClose={closeDrawer}
         size="100%"
         padding="md"
         title="EZAuction"
         hiddenFrom="sm"
         zIndex={1000000}
       >
         <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
           <Divider my="sm" />

           {
             navBarLinks.map((link) => (
               <Link to={link.to} className={classes.link}>{link.text}</Link>
             ))
           }
 
           <Divider my="sm" />
 
           <Group justify="center" grow pb="xl" px="md">
            <SignOutButton />
           </Group>
         </ScrollArea>
       </Drawer>
     </Box>
   );
 }