import "./Header.css"

export default function Header(value) {
    return(
        <header className="search-header">
            <div></div>
            <input 
                type="text"
                placeholder="Pesquisar"
            />
            <div></div>
        </header>
    )
}