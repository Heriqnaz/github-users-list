/* eslint-disable no-param-reassign, operator-assignment */
class UserList extends React.Component {
    state = {
        users: [],
    };

    componentDidMount() {
        client.getTimers((res) => {
            this.setState({users: res})
        })
    }

    handelEditUserLogin = (userId, login) => {
        const newUsers = this.state.users.map((user) => {
            if (user.id === userId) {
                return Object.assign({}, user, {
                    login: login
                });
            } else {
                return user;
            }
        });
        this.setState({
            users: newUsers,
        });
    }

    handelDeleteUserFromList = (userId) => {
        const newUsers = [...this.state.users];
        newUsers.map((user, index) => {
            if (userId === user.id) {
                newUsers.splice(index, 1);
                this.setState({users: newUsers});
            }
        })
    }

    render() {
        const users = this.state.users.sort((a, b) => {
            if (a.login.toLowerCase() < b.login.toLowerCase()) {
                return -1;
            }
            if (a.login.toLowerCase() > b.login.toLowerCase()) {
                return 1;
            }
            return 0;
        });
        const userComponent = users.map((user) => (
            <User
                key={`user-${user.id}`}
                id={user.id}
                avatar_url={user.avatar_url}
                login={user.login}
                html_url={user.html_url}
                onEdit = {this.handelEditUserLogin}
                onDelete = {this.handelDeleteUserFromList}
            />
            )
        )
        return (
            <div className='ui unstackable items'>
                {userComponent}
            </div>
        );
    }
}

class User extends React.Component {

    state = {
        isEdit: false
    }

    handleOpenInput = () => {
        this.setState({isEdit: true})
    }

    handleEditLogin = (event) => {
        event.preventDefault();
        this.props.onEdit(this.props.id, event.target.value);
    }

    handleDeleteUserFromList = () => {
        this.props.onDelete(this.props.id);
    }

    closeEditInput = (event) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            this.setState({isEdit: false});
        }
    }

    render() {
        return (
            <div className='item'>
                <div className='image'>
                    <img className='ui userImage medium circular image' src={this.props.avatar_url}/>
                </div>
                <div className='middle aligned content'>
                    <div className="ui blue horizontal label">User Login</div>
                    <div className={`header  ${this.state.isEdit ? "hide" : ""}`}>
                        {this.props.login}
                    </div>
                    <div className={`ui input ${!this.state.isEdit ? "hide" : ""}`}>
                        <input  type="text" value={this.props.login} onChange={this.handleEditLogin}  onKeyUp={this.closeEditInput}/>
                    </div>
                    <div onClick={this.handleOpenInput} className={`editIcon ui icon button ${this.state.isEdit ? "hide" : ""}`} data-inverted="" data-tooltip="Edit users login" data-position="top left">
                        <i className='pencil alternate icon' />
                    </div>
                    <div onClick={this.handleDeleteUserFromList} className={`editIcon ui icon button ${this.state.isEdit ? "hide" : ""}`} data-inverted="" data-tooltip="Delete user from list" data-position="top left">
                        <i className='delete icon' />
                    </div>
                    <div className='description'>
                        <i className='github icon' />
                        <a href={this.props.html_url} target="_blank">
                            {this.props.html_url}
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <UserList/>,
    document.getElementById('content')
);