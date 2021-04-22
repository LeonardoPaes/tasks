import { registerRootComponent } from 'expo';
import React, { Component } from 'react'
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native'
import AppLoading from 'expo-app-loading';
import { FontAwesome } from '@expo/vector-icons';

import commonStyles from '../commonStyles'
import todayImage from '../../assets/imgs/today.jpg'
import Task from '../components/Task.js';
import AsyncStorage from "@react-native-async-storage/async-storage"

import moment from 'moment'
import 'moment/locale/pt-br'

import AddTasks from './AddTasks';

import * as Font from 'expo-font';

let customFonts = {
  'Lato': require('../../assets/fonts/Lato.ttf'),
};

const initialState = {
    showDoneTasks: true,
    showAddTasks: false,
    visibleTasks: [],
    tasks: []
}

class TaskList extends Component{
    state = {
        ...initialState
    };

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
        //é como se eu chamasse a function logo depois, mas se eu passar ela para o set state, ele executa ela assim que ele atualizar o estado da variavel
    }

    // isPending = () => {
    //     return task.doneAt === null
    // } 

    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({visibleTasks})

        AsyncStorage.setItem('tasksState',JSON.stringify(this.state))
    }

    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task => {
            if (task.id === taskId) {
                task.doneAt = task.doneAt ? null : new Date()
            }
        });

        this.setState({tasks}, this.filterTasks)
    }

    addTask = (newTask) => {
        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }

        const tasks = [...this.state.tasks]
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })

        this.setState({tasks, showAddTasks: false}, this.filterTasks)
    }

    deleteTaks = (id) => {
        const tasks = this.state.tasks.filter(tasks => tasks.id !== id)
        this.setState({tasks}, this.filterTasks)
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount =  async () => {
        const stateString = await AsyncStorage.getItem('tasksState')
        const state = JSON.parse(stateString) || initialState
        this.setState({...state, fontsLoaded: false}, this.filterTasks)
        await this._loadFontsAsync();
    }

    render() {
        if (this.state.fontsLoaded) {
            const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
            return (
                <View style={styles.container}>
                    <AddTasks isVisible={this.state.showAddTasks}
                        onCancel={() => this.setState({showAddTasks: false})}
                        onSave={this.addTask}/>
                    <ImageBackground source={todayImage} style={styles.background}>
                        <View style={styles.iconBar}>
                            <TouchableOpacity onPress={this.toggleFilter}>
                                <FontAwesome name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} 
                                    size={20} color={commonStyles.colors.secondary}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>Hoje</Text>
                            <Text style={styles.subtitle}>{today}</Text>
                        </View>
                    </ImageBackground>
                    <View style={styles.taskList}>
                        <FlatList data={this.state.visibleTasks}
                            keyExtractor={item => `${item.id}`}
                            renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTaks}/>}/>      
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={()=> this.setState({showAddTasks:true})}
                        activeOpacity={0.7}>
                        <FontAwesome name="plus" isze={20} color={commonStyles.colors.secondary}/>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return <AppLoading />;
        }
    }
}

registerRootComponent(TaskList);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: 'Lato',
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    },
    subtitle: {
        fontFamily: 'Lato',
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 20,
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 40 : 30,
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center',
    }
});