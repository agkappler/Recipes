package com.utils.data;

import java.sql.PreparedStatement;
import java.sql.SQLException;

@FunctionalInterface
public interface ParamSetterGeneric<T> {
	void set(PreparedStatement ps, T object) throws SQLException;
}
