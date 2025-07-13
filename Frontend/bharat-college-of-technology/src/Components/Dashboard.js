import { useEffect, useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Bar } from 'react-chartjs-2'

import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchStudentPerCourse = async () => {
      try {
        const res = await ApiEndpoints.getStudentPerCourse()
        const result = res.data.data
        setData(result)
      } catch (error) {
        console.error(error.response?.data?.message || 'Fetch error')
      }
    }
    fetchStudentPerCourse()
  }, [])

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-start">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-lg rounded-4">
            <h5
              className="mb-3 fw-bold text-white bg-dark p-3 rounded-top text-center"
              style={{ letterSpacing: '2px' }}
            >
              Student by course
            </h5>
            <Bar
              data={{
                labels: data.map((item) => item.courseName),
                datasets: [
                  {
                    label: 'Students',
                    data: data.map((item) => item.studentCount),
                    backgroundColor: '#ffc107', // Yellow (Bootstrap warning)
                    hoverBackgroundColor: '#ffca2c',
                    borderRadius: 12,
                    barThickness: 45,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#343a40', // dark tooltip
                    titleColor: '#ffc107',
                    bodyColor: '#ffffff',
                  },
                },
                scales: {
                  x: {
                    ticks: { color: '#212529', font: { weight: 'bold' } },
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { color: '#212529' },
                    grid: { color: '#e0e0e0' },
                  },
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
