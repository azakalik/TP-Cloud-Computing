import {
   Group,
   Button,
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
 
 export function NavBar() {
   const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
   return (
     <Box>
       <header className={classes.header}>
         <Group justify="space-between" h="100%">
           <Image src="/logo.jpeg" alt="eZAuction" h={50}/>
 
           <Group h="100%" gap={0} visibleFrom="sm">
              <Link to='/' className={classes.link}>Home</Link>
              {/* <Link to='/my_auctions' className={classes.link}>My auctions</Link> */}
              <Link to='/new_auction' className={classes.link}>Add an auction</Link>
              <Link to='/about_us' className={classes.link}>About us</Link>
           </Group>
 
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
         title="Navigation"
         hiddenFrom="sm"
         zIndex={1000000}
       >
         <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
           <Divider my="sm" />
 
           <a href="#" className={classes.link}>
             Home
           </a>
           <a href="#" className={classes.link}>
             Learn
           </a>
           <a href="#" className={classes.link}>
             Academy
           </a>
 
           <Divider my="sm" />
 
           <Group justify="center" grow pb="xl" px="md">
             <Button variant="default">Log in</Button>
             <Button>Sign up</Button>
           </Group>
         </ScrollArea>
       </Drawer>
     </Box>
   );
 }