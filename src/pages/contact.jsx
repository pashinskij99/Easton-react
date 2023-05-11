import CForm from '../components/cform';


function Contact() {
  return (
      <div className="flex flex-col items-center content-center m-4 justify-items-center">
	  <CForm />
	  <div className="mt-4 text-center text-gray-400">
	      <a className="hover:text-gray-500 transition-all" href="https://www.google.com/maps/place/992+San+Antonio+Rd%2C+Palo+Alto%2C+CA"> 992 San Antonio Rd, Palo Alto, CA</a> | <a className="hover:text-gray-500 transition-all" href="mailto:support@eastonfin.com">support@eastonfin.com</a> | <a className="hover:text-gray-500 transition-all" href="tel:+1 650 275 3205">+1 650 275 3205</a>
	  </div>
      </div>
  );
}

export default Contact;
