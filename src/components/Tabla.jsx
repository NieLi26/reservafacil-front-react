import React from "react";

const Tabla = ({ children, tablaHeader }) => {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
        <tr>
            {tablaHeader.map((header, index) => (
                <th
                    key={index}
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                    {header}
                </th>
            ))}
          <th
            scope="col"
            className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6"
          >
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody
        id="table-body"
        className="divide-y divide-gray-200 bg-white"
      >
        {children}
      </tbody>
    </table>
  );
};

export default Tabla;
