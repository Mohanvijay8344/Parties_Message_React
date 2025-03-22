import React from "react";
import "./ContactList.css"; 

function ContactList() {
  const contacts = [
    { name: "Adiswar steel", number: "9243028102" },
    { name: "Ardit steel", number: "9148569360" },
    { name: "Agriplast", number: "99942 11042" },
    { name: "ARIHANT STEEL", number: "98450 09600" },
    { name: "Bharat Structurals", number: "99806 70006" },
    { name: "CALCUTTA TUBE", number: "9739242766" },
    { name: "CVS Trading company", number: "98804 55900" },
    { name: "Galvaline", number: "82979 24878" },
    { name: "GURU KRIPA MARKETING", number: "90360 01125" },
    { name: "METRO IRAN AND STEEL", number: "79 7556 6537" },
    { name: "MOHAN KHEDA", number: "94803 96396" },
    { name: "Mother India", number: "99801 48008" },
    { name: "Murlidhar steel", number: "99010 88811" },
    { name: "Mysore pipes suppliers", number: "9035065370" },
    { name: "RAJENDRA BUILDING PRODUCT", number: "98440 64806" },
    { name: "Shankara DAVANGERE", number: "81475 85471" },
    { name: "Shankara HUBLI", number: "99245 34578" },
    { name: "Shankara MANGALORE", number: "96865 76926" },
    { name: "Shankara PUTTUR", number: "96855 76926" },
    { name: "Shankara SHIMOGA", number: "97413 09112" },
    { name: "SHIVAM PRIME SALEM", number: "8072571366, 8144310002" },
    { name: "VIKASH PIPES", number: "8955318478" }
  ];

  return (
    <div className="contact-container">
      <h2>Contact List</h2>
      <table className="contact-table">
        <thead>
          <tr>
            <th>Party Name</th>
            <th>Contact Number</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={index}>
              <td>{contact.name}</td>
              <td>{contact.number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactList;
