.doctor-interface {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    max-width: 500px;
    padding: 20px;
    background-color: #444; /* Slightly different styling for variety */
    border-radius: 10px; /* Optional */
    color: white;
  }
  
  .doctor-interface h1,
  .doctor-interface h2 {
    margin: 0 0 20px;
  }
  
  .patient-queue {
    margin: 20px 0;
    width: 100%;
  }
  
  .patient-queue ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .patient-queue li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #333;
  }
  
  .patient-queue button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .patient-queue button:hover {
    background-color: #0056b3;
  }
  