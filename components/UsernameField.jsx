import React from 'react'

const UsernameField = ({completed, value, onSubmit, onChange}) => {
    if(completed) {return (
        <div></div>
    )
    } else return (
        <div>
            
            <form onSubmit={(e) => {e.preventDefault() || onSubmit(value)}}>
                <label>username:
                    <input type='text' name='username' value={value} onChange={(e) => {e.preventDefault() || onChange(e.target.value)}}></input>
                </label>
<               input type='submit' value='Submit'/>
            </form>
        </div>
   )
}

export default UsernameField
