import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

import moment from 'moment';
import 'moment/locale/pt-br'

import commonStyles from '../commonStyles';


export default props => {
    let [fontsLoaded] = useFonts({
        'Lato': require('../../assets/fonts/Lato.ttf'),
    });

    const doneOrNotStyle = props.doneAt != null ? 
        {textDecorationLine: 'line-through'} : {}
    
    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(props.estimateAt).locale('pt-br').format('ddd, D [de] MMMM')

    const getRightContent = () => {
        return(
            <TouchableOpacity style={styles.right}
                onPress={() => props.onDelete && props.onDelete(props.id)}>
                <FontAwesome name="trash" size={30} color="#FFF"/>
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return(
            <View style={styles.left}>
                <FontAwesome name="trash" size={20} color="#FFF" style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return(
            <Swipeable renderRightActions={getRightContent} renderLeftActions={getLeftContent}
                onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback
                        onPress={() => props.onToggleTask(props.id)}>
                        <View style={styles.checkContainer}>
                            {getCheckView(props.doneAt)}
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                        <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>       
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                </View>
            </Swipeable>
        )
    }
}

function getCheckView(doneAt) {
    if (doneAt != null) {
        return (
            <View style={styles.done}>
                <FontAwesome name="check" size={20} color="#FFF"/>
            </View>
        )
    }else{
        return (
            <View style={styles.pending}></View>
        )
    }
    
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: "#FFF",
    },
    checkContainer: {
        width: "20%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center',
    },
    desc: {
        fontFamily: 'Lato',
        color: commonStyles.colors.mainText,
        fontSize: 15
    },
    date: {
        fontFamily: 'Lato',
        color: commonStyles.colors.subText,
        fontSize: 12
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    excludeText: {
        fontFamily: 'Lato',
        color: "#FFF",
        fontSize: 20,
        margin: 10,
    },
    excludeIcon: {
        marginLeft: 10,
    }
});