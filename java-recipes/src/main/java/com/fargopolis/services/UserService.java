package com.fargopolis.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fargopolis.models.User;
import com.utils.data.Data;
import com.utils.exceptions.ObjectNotFoundException;

@Service
public class UserService extends BaseService {
    private static String GET_USER_BY_EMAIL_SQL = "SELECT * FROM users WHERE email = ?";
    private static String CREATE_USER_SQL = "INSERT INTO users (email, password) VALUES (?,?) RETURNING user_id";

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserService(DataSource dataSource, Data data) {
        super(dataSource, data);
    }

    public User getUser(Integer userId) {
        return new User();
    }

    public User getUser(String email) throws ObjectNotFoundException, SQLException {
        List<User> results = this.data.Query(
                GET_USER_BY_EMAIL_SQL,
                (PreparedStatement ps) -> ps.setString(1, email),
                (ResultSet rs) -> this.mapUser(rs));

        if (results.size() == 0) {
            throw new ObjectNotFoundException("Failed to load User with email: " + email);
        }

        return results.get(0);
    }

    public User authenticateUser(String email, String password) throws Exception {
    	try {
	        User user = getUser(email);
	        if (passwordEncoder.matches(password, user.getPassword())) {
	        	user.setPassword(null);
	        	return user;
	        }
    	} catch (ObjectNotFoundException e) {
    		
    	}

        throw new Exception("Unauthorized user");
    }
    
    public User createUser(String email, String password) throws Exception {
        Integer userId = this.data.InsertWithKey(
    		CREATE_USER_SQL,
    		(PreparedStatement ps) -> {
    			ps.setString(1, email);
    			ps.setString(2, passwordEncoder.encode(password));
    		});
        
        return new User(userId, email, password);
    }

    private User mapUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setUserId(rs.getInt("user_id"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        return user;
    }
}
