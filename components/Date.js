import { Text, StyleSheet } from "react-native";
const Date = ({date}) => {
    const getDay = (date) => date.toLocaleString('en-US', { weekday: 'long' });
    const getMonth = (date) => date.toLocaleString('en-US', { month: 'long' });
    const getTime = (date) => date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <>
            <Text style={styles.date}>{`${getDay(date)}, ${getMonth(date)} ${date.getDate()}th`}</Text>
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

export default Date;