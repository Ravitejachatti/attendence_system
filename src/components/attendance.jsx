
import React, { useState } from 'react';
import Papa from 'papaparse';
import './attendance.css';



function getStatusSymbol(status) {
  switch(status) {
    case 'P':
      return '✅'; // Tick emoji for present
    case 'A':
      return '❌'; // Cross emoji for absent
    default:
      return '-'; // Hyphen for nil or unknown
  }
}




function AttendancePage() {
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    month: '',
    session: ''
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(31); // Default to 31, can adjust dynamically
  const [showDisplayData, setShowDisplayData] = useState(false);
  const [showTable, setShowTable] = useState(false); // New state variable for showing the table

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  
    if (name === 'month') {
      const monthIndex = new Date(Date.parse(value +" 1, 2022")).getMonth(); // Ensure this parses correctly
      const year = new Date().getFullYear(); // You can adjust this based on your requirements
      setDaysInMonth(new Date(year, monthIndex + 1, 0).getDate());
    }
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.class || !formData.section || !formData.month || !formData.session) {
      alert('All fields are mandatory');
      return; // Stop the form submission if any field is empty
    }
  
    const filePath = `class/${formData.class}/${formData.section}/${formData.month}/${formData.session}.csv`;
    handleFetchData(filePath);
    
  };


  
  
  const handleReset = () => {
    setFormData({
      class: '',
      section: '',
      month: '',
      session: ''
    });
    setAttendanceData([]);
    setShowTable(false);
  };
  
  const handleFetchData = (filePath) => {
    const serverURL = 'http://localhost:3001/check-file';
    const queryParams = new URLSearchParams({ filePath });

    fetch(`${serverURL}?${queryParams}`)
        .then(res => res.json())
        .then(data => {
            if (data.exists) {
                // If file exists, parse it with PapaParse
                Papa.parse(filePath, {
                    download: true,
                    header: false,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.data && results.data.length > 1) {
                            setAttendanceData(results.data.slice(1));
                            setShowTable(true);
                        } else {
                            alert('No data available for the selected options.');
                            setAttendanceData([]);
                            setShowTable(false);
                        }
                    },
                    error: (error) => {
                        console.error("Error loading CSV: ", error);
                        alert('Failed to load data. Please ensure the file exists and is accessible.');
                        setAttendanceData([]);
                        setShowTable(false);
                    }
                });
            } else {
                console.error('File does not exist:', filePath);
                alert('File does not exist.');
                setAttendanceData([]);
                setShowTable(false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        });
};

  return (
    <div>
      <div  className='formSection'>
      <div className='titleSection'><h1>Student Attendance</h1></div>
      
        
        
      <form onSubmit={handleSubmit}>
      <div className='inputSection'>
        <div className="inputElemet">
        <h3>Select Class</h3>
      <select className=" options class "name="class" value={formData.class} onChange={handleChange}>
      
          <option className="formlabel" value="">Select Class</option>
          <option value="10">10</option>
          <option value="11">11</option>
        </select>
        </div>
        <div className='inputElemet'>
        <h3>Select Section</h3>
      <select className=" options class "name="section" value={formData.section} onChange={handleChange}>
      
          <option className="formlabel" value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        </div>
        <div className='inputElemet'>
        <h3>Select Month</h3>
      <select className=" options class "name="month" value={formData.month} onChange={handleChange}>
      
          <option className="formlabel" value="">Select Month</option>
          <option value="January">January</option>
          <option value="february">February</option>
        </select>
        </div>
        <div className='inputElemet'>
        <h3>Select Session</h3>
      <select className=" options class "name="session" value={formData.session} onChange={handleChange}>
      
          <option className="formlabel" value="">Select Session</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
        </select>
        </div></div>
        <div className='buttonstyle'>
        <button  className="saveButton" type="submit">Save</button>
        <button className="resetButton" type="button" onClick={handleReset}>Reset</button>
        </div>
        
        

      </form>
      </div>
      

      {showTable && attendanceData.length > 0 && (
        <div className='tableSection'>
        {showDisplayData && (
           <div >
             <h2 className="display-data">Attendance SheetClass {formData.class}: Section {formData.section},{formData.month} 2019:</h2>
             
             
           </div>
         )}
        <table>
           <thead>
             <tr>
               <th>Name</th>
               {Array.from({ length: daysInMonth }, (_, i) => (
                 <th key={i + 1}>{i + 1}</th>
               ))}
             </tr>
           </thead>
           <tbody>
     {attendanceData.map((person, index) => (
       <tr key={index}>
         <td>{person[0]}</td> {/* Accessing the first element as name */}
         {Array.from({ length: daysInMonth }, (_, dayIndex) => (
           <td key={dayIndex + 1}>
             {getStatusSymbol(person[dayIndex + 1] || '-')}
           </td>
         ))}
       </tr>
     ))}
   </tbody>
   
         </table>
        </div>
      )}:
    </div>
  );
}

export default AttendancePage;
