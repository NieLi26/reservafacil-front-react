import React from "react";

const TablaBody = ({tarifa}) => {
    const items = Object.values(tarifa)
  return (
    <>
        {items.map( (item, index) => (
            <td 
                key={index}
                className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
            >{item}</td>
        ))}
    </>
  );
};

export default TablaBody;
