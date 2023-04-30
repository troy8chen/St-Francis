import ClientSearchForm from '@/components/Client/ClientSearchForm/ClientSearchForm';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

describe('Client Info Form Component', () => {
    const mockClient = {
        firstName: 'First',
        lastName: 'Last',
        firstNameLower: 'first',
        lastNameLower: 'last',
        middleInitial: 'M',
        birthday: '2003-12-13',
        gender: 'Gender',
        race: 'Race',
        postalCode: '123456',
        numKids: 0,
        notes: 'Notes',
        isCheckedIn: false,
        isBanned: false,
        unhoused: false,
    };
    it('matches snapshot without any props', async () => {
        const tree = renderer
            .create(<ClientSearchForm onSubmit={() => {}} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('renders correctly without initial data', async () => {
        await act(async () => {
            render(<ClientSearchForm onSubmit={() => {}} />);
        });
        const title = screen.queryByRole('heading', {
            name: 'Lookup Client',
        });
        expect(title).toBeInTheDocument();
        expect(screen.queryByText('First name')).toBeInTheDocument();
        expect(screen.queryByText('Last name')).toBeInTheDocument();
        expect(screen.queryByText('Birthday')).toBeInTheDocument();
        expect(screen.queryByText('Search')).toBeInTheDocument();
        expect(screen.queryByText('New Client')).toBeInTheDocument();
        expect(screen.queryByText('Clear')).toBeInTheDocument();
    });

    it('search correctly with onSubmit injected', async () => {
        const mockSubmit = jest.fn();
        const mockOnClear = jest.fn();
        await act(async () => {
            render(
                <ClientSearchForm
                    onSubmit={mockSubmit}
                    onClear={mockOnClear}
                    initialFields={{ filterByBirthday: true,  ...mockClient}}
                />
            );
        });
        const searchBtn = screen.queryByText('Search') as HTMLButtonElement;
        const clearBtn = screen.queryByText('Clear') as HTMLButtonElement;
        const birthdayInput = screen.queryByLabelText('Birthday') as HTMLInputElement;
        
        fireEvent.click(searchBtn);
        expect(mockSubmit).toHaveBeenCalledTimes(1);
        expect(birthdayInput.value).toBe(mockClient.birthday);
        
        fireEvent.click(clearBtn);
        expect(mockOnClear).toHaveBeenCalledTimes(1);
        expect(birthdayInput.value).toBe('');
    });

    //TODO: test checkbox
});
