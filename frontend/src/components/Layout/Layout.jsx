import Header from "../Header/Header";
import Nav from "../Nav/Nav"

export default function Layout({ children }) {
    return (
        <>
            <Header/>
            <main> {children} </main>
            <Nav/>
        </>
    );
}