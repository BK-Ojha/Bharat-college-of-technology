import { Button, Form, Modal } from 'react-bootstrap'
import { FaArrowAltCircleLeft, FaSave } from 'react-icons/fa'
import ButtonWithLoader from './ButtonWithLoader'
import { useState } from 'react'

export default function PreviewCourseDataModal({
  show,
  onHide,
  onBackToEdit,
  onConfirm,
  originalData,
  formData,
}) {
  const getClassName = (key) => {
    const original = originalData?.[key] || ''
    const updated = formData?.[key] || ''
    return original !== updated ? 'blink' : ''
  }
  const [isLoading, setIsLoading] = useState(false)
  return (
    <>
      <style>
        {`
          .blink{
            animation: blinker 1s linear infinite;
            background-color:#fff3cd;
          }  
            @keyframes blinker{
                50%{
                opacity:0;
                }
            }
            `}
      </style>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header className="bg-info justify-content-center">
          <Modal.Title>
            Preview <span className="text-white fw-bold">{formData?.name}</span>
            's Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-bordered">
            <tbody>
              {Object.entries(formData).map(([key, value]) => (
                <tr key={key}>
                  <th className="text-capitalize"> {key.replace(/_/g, '')} </th>
                  <td className={getClassName(key)}> {value || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal.Footer className="bg-dark rounded">
            <Button
              onClick={onBackToEdit}
              variant="link"
              className="link-info fw-semibold text-decoration-none"
            >
              [ <FaArrowAltCircleLeft /> Back to update ]
            </Button>
            <ButtonWithLoader
              onClick={async () => {
                setIsLoading(true)
                try {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  await onConfirm()

                  onHide()
                } finally {
                  setIsLoading(false)
                }
              }}
              isLoading={isLoading}
              variant="link"
              className="link-warning fw-semibold text-decoration-none"
            >
              <>
                [ <FaSave /> Confirm ]
              </>
            </ButtonWithLoader>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}
