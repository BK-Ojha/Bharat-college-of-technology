import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function PreviewDataModal({
  show,
  onHide,
  onBackToEdit,
  formData,
  onConfirm,
  originalData,
  courseName,
}) {
  const getClassName = (key) => {
    const original = originalData?.[key] || ''
    const updated = formData?.[key] || ''
    return original !== updated ? 'blink' : ''
  }

  return (
    <>
      <style>
        {`
      .blink {
        animation: blinker 1s linear infinite;
        background-color: #fff3cd;
      }

      @keyframes blinker {
        50% {
          opacity: 0;
        }
      }
    `}
      </style>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header className="bg-info" closeButton>
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
                  <th className="text-capitalize">{key.replace(/_/g, ' ')}</th>
                  <td className={getClassName(key)}>
                    {key === 'course_id' ? courseName : value || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onBackToEdit} variant="outline-warning">
            Back to Edit
          </Button>
          <Button
            onClick={async () => {
              await onConfirm()
              onHide()
            }}
            variant="outline-success"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
