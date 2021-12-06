import React from 'react';

const TextName = ({title, rows, data, setData}) => {
    return ( 
        <div className="form-group">
            <label>{title}</label>
            <textarea className="form-control" rows={rows} placeholder="Nombre del cliente" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
     );
}
 
export default TextName;