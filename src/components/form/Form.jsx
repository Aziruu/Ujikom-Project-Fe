const Form = ({ onSubmit, children, className }) => {
  return (
    <form
      onSubmit={event => {
        event.preventDefault() // Prevent default form submission
        onSubmit(event)
      }}
      // Default spacing between form fields
      className={` ${className}`}
    >
      {children}
    </form>
  )
}

export default Form
