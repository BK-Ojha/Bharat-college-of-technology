import { Button, Spinner } from 'react-bootstrap'

export default function ButtonWithLoader({
  isLoading,
  onClick,
  children,
  disabled,
//   variant = 'link-warning',
  size = 'md',
  ...rest
}) {
  return (
    <Button
    //   variant={variant}
      size={size}
      onClick={onClick}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
