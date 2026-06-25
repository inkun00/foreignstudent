import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../app/page';

// Mock the ChatRoom component as we only want to test the Lobby UI here
jest.mock('../app/components/ChatRoom', () => {
  return function MockChatRoom() {
    return <div data-testid="mock-chatroom">Mock ChatRoom</div>;
  };
});

describe('Lobby Component', () => {
  test('should render elements correctly and disable the start button initially', () => {
    render(<Home />);

    // Check title is rendered
    expect(screen.getByText('다옴톡 (DaomTalk)')).toBeInTheDocument();

    // Check input is empty
    const nameInput = screen.getByLabelText('본인의 이름 (닉네임)');
    expect(nameInput).toHaveValue('');

    // Check that start button is disabled
    const startBtn = screen.getByRole('button', { name: /대화 시작하기/ });
    expect(startBtn).toBeDisabled();
  });

  test('should keep the start button disabled if only name is entered', () => {
    render(<Home />);

    const nameInput = screen.getByLabelText('본인의 이름 (닉네임)');
    fireEvent.change(nameInput, { target: { value: '김선생' } });

    const startBtn = screen.getByRole('button', { name: /대화 시작하기/ });
    expect(startBtn).toBeDisabled();
  });

  test('should keep the start button disabled if only country is selected', () => {
    render(<Home />);

    // Select Vietnam card
    const vietnamCard = screen.getByTestId('country-card-베트남');
    fireEvent.click(vietnamCard);

    const startBtn = screen.getByRole('button', { name: /대화 시작하기/ });
    expect(startBtn).toBeDisabled();
  });

  test('should enable start button when both name and country are specified', () => {
    render(<Home />);

    const nameInput = screen.getByLabelText('본인의 이름 (닉네임)');
    fireEvent.change(nameInput, { target: { value: '김선생' } });

    const vietnamCard = screen.getByTestId('country-card-베트남');
    fireEvent.click(vietnamCard);

    const startBtn = screen.getByRole('button', { name: /대화 시작하기/ });
    expect(startBtn).not.toBeDisabled();

    // Click start chat and check transition
    fireEvent.click(startBtn);
    expect(screen.getByTestId('mock-chatroom')).toBeInTheDocument();
  });
});
