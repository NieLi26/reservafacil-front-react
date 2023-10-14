import React from 'react'

const Paginacion = ({paginator, setPagina, pagina}) => {

    const { number, total_pages, has_previous, has_next, paginate_by, total_results, start_index, end_index } = paginator;

    const nextPage = () => {
        if ( total_pages > pagina) {
            setPagina(pagina + 1)
        }
    }

    const prevPage = () => {
        if ( 1 < pagina) {
            setPagina(pagina - 1)
        }
    }
    
   // Calcula el rango de páginas a mostrar (por ejemplo, 3 páginas)
//    const pagesToShow = 3;
//    let pageRange = Math.min(total_pages, pagesToShow);
//    if (pagina + pageRange > total_pages) {
//      pageRange = total_pages - pagina + 1;
//    }
//    const pages = Array.from({ length: pageRange }, (_, i) => pagina + i);

// Calcula el rango de páginas a mostrar (exactamente 3 páginas)
const pagesToShow = 3;
let startPage = pagina;
let endPage = pagina + 2;

if (endPage > total_pages) {
  endPage = total_pages;
  startPage = endPage - (pagesToShow - 1);
}

const pages = Array.from({ length: pagesToShow }, (_, i) => startPage + i);


  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
                <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Mostrando
                        <span className="font-medium px-1">{start_index}</span>
                        a
                        <span className="font-medium px-1">{end_index}</span>
                        de
                        <span className="font-medium px-1">{total_results}</span>
                        Resultados
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    { 1 < pagina && (
                        <button
                            onClick={prevPage}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                            <span className="sr-only">Previous</span>
                            <svg className="pointer-events-none h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"/>
                            </svg>
                        </button>
                    )}

                    {/* {Array.from(Array(total_pages).keys()).map(position => (
                        <button 
                            key={position + 1}
                            onClick={() => {
                                setPagina(position + 1)
                            }} 
                            className={ position + 1 === page ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'  }>
                            {position + 1}
                        </button>
                    )) } */}

                    {pages.map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => {
                                    setPagina(pageNumber);
                                }}
                                className={
                                    pageNumber === pagina
                                    ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                    : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                }
                            >
                            {pageNumber}
                            </button>
                        ))}

                    { total_pages > pagina && (
                        <button
                            onClick={nextPage}
                            className="next-btn relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                            <span className="sr-only">Next</span>
                            <svg className="pointer-events-none h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"/>
                            </svg>
                        </button>
                    ) }
                    </nav>
                </div>
            </div>
    </div>
  )
}

export default Paginacion
