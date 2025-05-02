package com.utils;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@FunctionalInterface
public interface ParamSetter {
    void set(PreparedStatement ps) throws SQLException;
}
