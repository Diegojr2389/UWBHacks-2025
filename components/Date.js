import { Text, StyleSheet } from "react-native";
const FormattedDate = ({date}) => {
    const currentDay = new Date();
    const getDay = (date) => date.toLocaleString('en-US', { weekday: 'long' });
    let day = getDay(date);
    if (date.getDate() === currentDay.getDate() && date.getMonth() === currentDay.getMonth() && date.getFullYear() === currentDay.getFullYear()) day = "Today";
    else if (date.getDate() === currentDay.getDate() - 1 && date.getMonth() === currentDay.getMonth() && date.getFullYear() === currentDay.getFullYear()) day = "Yesterday";
    
    const getMonth = (date) => date.toLocaleString('en-US', { month: 'long' });
    const getTime = (date) => date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <>
            <Text style={styles.date}>{`${day}, ${getMonth(date)} ${date.getDate()}th`}</Text>
            <Text style={styles.date}>{`${getTime(date)}`}</Text>
        </>
    );
};

const styles = StyleSheet.create({
    date: {
        color: 'white',
        fontSize: 14
    },
});

export default FormattedDate;