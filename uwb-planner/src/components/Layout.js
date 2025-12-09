// delete this file and the navbar will break
// just dont
// -avz
import Navbar from './Navbar.jsx';
import { Outlet } from 'react-router-dom';

export function Layout(){
    return(
        <div className="layout">
            <Navbar />
            <main className="content">
                <Outlet/>
            </main>
        </div>
    );
}
