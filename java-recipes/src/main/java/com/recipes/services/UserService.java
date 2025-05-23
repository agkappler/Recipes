package com.recipes.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.recipes.models.User;
import com.utils.data.Data;
import com.utils.exceptions.ObjectNotFoundException;

@Service
public class UserService extends BaseService {
    private static String GET_USER_BY_EMAIL_SQL = "SELECT * FROM users WHERE email = ?";

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
        User user = getUser(email);
        if (user.getPassword().equals(password)) {
            return user;
        }

        throw new Exception("Unauthorized user");
    }

    private User mapUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setUserId(rs.getInt("user_id"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        return user;
    }
}
