"use client";

import React, { useState } from 'react';
import { Select, Table, Spin, Card } from 'antd';
import { FileTextOutlined, QuestionCircleOutlined, EditOutlined, BarChartOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;

const SIDEBAR_WIDTH = '250px'; // Adjust the width according to your sidebar's width

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: ${SIDEBAR_WIDTH};
  padding: 20px;
  width: calc(100% - ${SIDEBAR_WIDTH});
  min-height: 100vh;
`;

const StyledSelect = styled(Select)`
  width: 600px;
  margin-bottom: 20px; // Add space below the Select
  font-size: 16px; // Larger font size for the select options
`;

const StyledTable = styled(Table)`
width: 600px;
margin-bottom: 40px;
background: #fff;
padding: 24px;
border-radius: 8px;

  .ant-table-thead > tr > th {
    font-size: 16px; // Even larger font size for table headers
  }
  .ant-table-tbody > tr > td {
    font-size: 14px; // Even larger font size for table cells
  }

  .anticon {
    font-size: 24px; // Larger icon size
    margin-right: 8px; // Space between icon and text
  }
`;

const StyledCard = styled(Card)`
  width: 80%; // Set a maximum width for the cards
  margin-bottom: 20px;

  .ant-card-head-title {
    font-size: 20px; // Larger font size for card titles
  }
  .ant-card-body {
    font-size: 14px; // Larger font size for card content
  }
`;

// Mock function to simulate fetching data from an API
const fetchScores = async (courseId) => {
  // This would be replaced with an actual API call using the courseId
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        assignments: [
          { key: '1', type: 'Homework 1', score: 85 },
          { key: '2', type: 'Homework 2', score: 90 },
          // ... more assignments
        ],
        quizzes: [
          { key: '1', type: 'Quiz 1', score: 78 },
          // ... more quizzes
        ],
        exams: [
          { key: '1', type: 'Midterm', score: 88 },
          // ... more exams
        ],
        finalGrade: 92,
      });
    }, 1000);
  });
};

const ResultsPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCourseChange = async (value) => {
    setLoading(true);
    const fetchedScores = await fetchScores(value);
    setScores(fetchedScores);
    setSelectedCourse(value);
    setLoading(false);
  };

  // Simulated list of courses
  const courses = [
    { id: '1', name: 'Mathematics' },
    { id: '2', name: 'Physics' },
    // ... other courses
  ];

  const scoreColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
  ];

    return (
        <ResultsContainer>
          <StyledSelect
            showSearch
            placeholder="Select a course"
            optionFilterProp="children"
            onChange={handleCourseChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
        {courses.map((course) => (
          <Option key={course.id} value={course.id}>{course.name}</Option>
        ))}
     </StyledSelect>

     {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      ) : selectedCourse && scores ? (
        <div>
          <StyledCard title="Assignments">
            <StyledTable columns={scoreColumns} dataSource={scores.assignments} pagination={false} />
          </StyledCard>
          <StyledCard title="Quizzes">
            <StyledTable columns={scoreColumns} dataSource={scores.quizzes} pagination={false} />
          </StyledCard>
          <StyledCard title="Exams">
            <StyledTable columns={scoreColumns} dataSource={scores.exams} pagination={false} />
          </StyledCard>
          <StyledCard title="Final Grade">
          <p><BarChartOutlined /> {scores.finalGrade}</p>
          </StyledCard>
        </div>
      ) : null}
    </ResultsContainer>
  );
};

export default ResultsPage;