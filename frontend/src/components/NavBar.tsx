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
import { SignInButton } from './SignInButton';
 
 export function NavBar() {
   const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
   return (
     <Box pb={40}>
       <header className={classes.header}>
         <Group justify="space-between" h="100%">
           <Image src="/logo.jpeg" alt="eZAuction" h={50}/>
 
           <Group h="100%" gap={0} visibleFrom="sm">
             <a href="/" className={classes.link}>
               Home
             </a>
             <a href="my_auctions" className={classes.link}>
              My auctions
             </a>
             <a href="new_auction" className={classes.link}>
               Add an auction
             </a>
             <a href="about_us" className={classes.link}>
               About us
             </a>
           </Group>
 
           <Group visibleFrom="sm">
             <SignInButton />
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