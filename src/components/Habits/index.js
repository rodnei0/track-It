import { useEffect, useMemo, useState, useContext } from 'react';
import { usePromiseTracker, trackPromise } from 'react-promise-tracker';
import { Container, Div, H3 } from './styles';
import Top from '../TopBar';
import Bottom from '../BottomBar';
import MyHabits from './myhabits';
import CreateHabits from './createhabits';
import UserContext from '../../contexts/UserContext';
import axios from 'axios';

function Habits({ setMainPage }) {
    setMainPage(false);
    const days = [  {id: 0, name: "D"}, 
                    {id: 1, name: "S"}, 
                    {id: 2, name: "T"}, 
                    {id: 3, name: "Q"}, 
                    {id: 4, name: "Q"}, 
                    {id: 5, name: "S"}, 
                    {id: 6, name: "S"}
                ];
    
    const [ hide, setHide ] = useState(true);
    const [ selectedDays, setSelectedDays ] = useState([]);
    const [ habit, setHabit ] = useState("");
    const [ habits, setHabits ] = useState([]);
    const { promiseInProgress } = usePromiseTracker();
    const { token } = useContext(UserContext);
    
    let hideText = false;

    const data = {
        name: habit,
        days: selectedDays,
    };

    const config = useMemo(() => {
        const data = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        return data;
    }, [token]);
    
    useEffect(fetch, [config]);

    if (habits.length > 0) {
        hideText = true;
    }

    function handleDisplay(option) {
        if (option === "create") {
            setHide(false);
        } else {
            setHide(true);
        }
    }

    function handleSelection(day) {
        if (selectedDays.includes(day)) {
            const filteredDays = selectedDays.filter(selectedDay => selectedDay !== day);
            setSelectedDays([...filteredDays]);
            return;
        }
        setSelectedDays([...selectedDays, day])
    }

    function handleDeletion(id) {
        if (window.confirm("Tem certeza?")){
            const promisse = axios.delete(`https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${id}`, config);
            promisse.then(fetch);
        }
    }
    
    function handlePostResponse() {
        fetch();
        setHabit("");
        setSelectedDays([]);
        setHide(true);
    }
    
    function verifyHabit() {
        if (habit === "") {
            alert("De um nome para o seu habito!");
        } else if (selectedDays.length === 0) {
            alert("Selecione pelo menos um dia!");
        } else {
            trackPromise(post())
        }
    }
    
    function fetch() {
        const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits", config);
        promisse.then(response => setHabits([...response.data]));
    }

    function post() {
        const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits", data, config);
        promisse.then(handlePostResponse);
        promisse.catch(response => console.log(response));
        return promisse ;
    }

    return (
        <>
            <Top />
            <Container>
                <Div>
                    <h1>Meus Hábitos</h1>
                    <button onClick={() => handleDisplay("create")}>+</button>
                </Div>
                <CreateHabits   
                    hide={hide} 
                    habit={habit}
                    setHabit={setHabit}
                    promiseInProgress={promiseInProgress}
                    days={days}
                    handleSelection={handleSelection}
                    selectedDays={selectedDays}
                    handleDisplay={handleDisplay}
                    verifyHabit={verifyHabit}>
                </CreateHabits>
                <MyHabits habits={habits} days={days} handleDeletion={handleDeletion}></MyHabits>
                <H3 hide={hideText}>Você não tem nenhum hábito cadastrado ainda. Adicione um hábito para começar a trackear!</H3>
            </Container>
            <Bottom />
        </>
    );
};

export default Habits;