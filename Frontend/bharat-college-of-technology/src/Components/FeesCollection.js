import React, { useEffect, useState } from 'react';
import { Table, Card, Tabs, Tab, Row, Col } from 'react-bootstrap';
import ApiEndpoints from '../CommonComponents/ApiEndpoints';


export default function FeesCollection() {
  const [data, setData]=useState({
    monthly:[],
    quarterly:[],
    yearly:[]
  })

  const formatMonthlyData = (fees) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"]; 
    return fees.map((item) => {
      const month = monthNames[(item._id.month || 1) - 1];
      return {
        month: `${month} ${item._id.year}`,
        total_fees_applied: item.total_fees_applied ?? 0,
        total_collected_fees: item.total_collected_fees ?? 0,  
        pending: 0,
      };
    });
  };
  

  const formatQuarterlyData = (fees)=>fees.map((item)=>({
    quarter:`Q${item._id.quarter} ${item._id.year}`,
    total_fees_applied: item.total_fees_applied ?? 0,
    total_collected_fees: item.total_collected_fees ?? 0,  
    pending:0
  }))

  const formatYearlyData = (fees)=>fees.map((item)=>({
    year: `${item._id.year}`,
    total_fees_applied: item.total_fees_applied ?? 0,
    total_collected_fees: item.total_collected_fees ?? 0,  
    pending: 0
  }))

  const fetchFeesCollection = async ()=>{
    try {
      const monthlyRes = await ApiEndpoints.getFeesCollection("monthly")
      const quarterlyRes = await ApiEndpoints.getFeesCollection("quarterly")
      const yearlyRes = await ApiEndpoints.getFeesCollection("yearly")
      
      setData({
        monthly: formatMonthlyData(monthlyRes.data.fees_collection),
      quarterly: formatQuarterlyData(quarterlyRes.data.fees_collection),
      yearly: formatYearlyData(yearlyRes.data.fees_collection),
      })
      // console.log("Fees Collection Response:",response.data.fees_collection)
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }
  useEffect(()=>{
    fetchFeesCollection()
  },[])
  const [activeTab, setActiveTab] = useState('monthly');

  const renderTable = (data, type) => (
    <Table striped bordered hover responsive className="mt-3 text-center">
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>{type === 'monthly' ? 'Month' : type === 'quarterly' ? 'Quarter' : 'Year'}</th>
          <th>Total Amount</th>
          <th>Collected</th>
          <th>Pending</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{d.month || d.quarter || d.year}</td>
            <td>₹{d.total_fees_applied}</td>
            <td>₹{d.total_collected_fees}</td>
            <td>{d.total_pending ? `₹ ${d.total_pending}` : `₹ 0`}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderCards = (data) => {
    const total_fees_applied = data.reduce((sum, d) => sum +( d.total_fees_applied ?? 0), 0);
    const total_collected_fees = data.reduce((sum, d) => sum + (d.total_collected_fees ?? 0), 0);
    const total_pending = data.reduce((sum, d) => sum + (d.total_pending ?? 0), 0);

    return (
      <div className="row mt-4">
        <div className="col-md-4">
          <Card bg="success" text="white" className="text-center shadow-lg">
            <Card.Body>
              <Card.Title>Total Collected</Card.Title>
              <h4>₹ {total_collected_fees}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card bg="warning" text="dark" className="text-center shadow-lg">
            <Card.Body>
              <Card.Title>Total Pending</Card.Title>
              <h4>₹ {total_pending}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card bg="info" text="white" className="text-center shadow-lg">
            <Card.Body>
              <Card.Title>Total Fees Applied</Card.Title>
              <h4>₹ {total_fees_applied}</h4>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div>
         <Row
              className="bg-dark rounded-top custom-row mt-4 d-flex align-items-center justify-content-between"
              style={{ height: '70px' }}
            >
              <Col>
                <h3 className="m-0 gap-1 d-flex align-items-center text-warning fw-bold">
                  ---| <span className="text-white">Fees Collection Summary</span> |---
                </h3>
              </Col>
              {/* <Col xs={12} md={5} className="mx-auto mt-2">
                <Select
                  options={courseOptions}
                  isClearable
                  placeholder="🔍 Search or select a course..."
                  onChange={(selected) => setSelectOption(selected)}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: state.isFocused ? 'black' : base.borderColor, // ✅ dark border on focus
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: 'black',
                      },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? 'black' : 'white',
                      color: state.isFocused ? 'white' : 'black',
                      cursor: 'pointer',
                    }),
                    clearIndicator: (base) => ({
                      ...base,
                      cursor: 'pointer',
                      color: 'red',
                    }),
                  }}
                />
              </Col> */}
              <Col className="text-end">
                {/* <Button
                  variant="link"
                  className=" text-decoration-none text-white"
                  onClick={handleOpenAddModal}
                >
                  [ <FaPlus size={20} /> Add New Course ]
                </Button> */}
              </Col>
            </Row>
      <div className="container mt-4 mb-5">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3 justify-content-center"
      >
        <Tab eventKey="monthly" title="Monthly">
          {renderCards(data.monthly)}
          {renderTable(data.monthly, 'monthly')}
        </Tab>
        <Tab eventKey="quarterly" title="Quarterly">
          {renderCards(data.quarterly)}
          {renderTable(data.quarterly, 'quarterly')}
        </Tab>
        <Tab eventKey="yearly" title="Yearly">
          {renderCards(data.yearly)}
          {renderTable(data.yearly, 'yearly')}
        </Tab>
      </Tabs>
    </div>
    </div>
  );
}
