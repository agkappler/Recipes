package com.utils.data;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import javax.sql.DataSource;

import org.springframework.transaction.annotation.Transactional;

public class Data {
    private final DataSource dataSource;

    public Data(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void Execute(String sql) throws SQLException {
        PreparedStatement ps = null;
        try (Connection conn = dataSource.getConnection()) {
            ps = conn.prepareStatement(sql);
            ps.execute();
        } finally {
            this.close(ps, null);
        }
    }

    public void Execute(String sql, ParamSetter paramSetter) throws SQLException {
        PreparedStatement ps = null;
        ResultSet generatedKeys = null;
        try (Connection conn = dataSource.getConnection()) {
            ps = conn.prepareStatement(sql);
            paramSetter.set(ps);
            ps.executeUpdate();
        } finally {
            this.close(ps, generatedKeys);
        }
    }

    @Transactional
    public List<Integer> ExecuteTransaction(List<String> sqlStrings, List<ParamSetter> paramSetters)
            throws SQLException {
        if (sqlStrings.size() != paramSetters.size()) {
            throw new IllegalArgumentException("SQL list and ParamSetter list must be the same size");
        }

        List<Integer> generatedKeys = new ArrayList<>();

        try (Connection conn = dataSource.getConnection()) {
            for (int i = 0; i < sqlStrings.size(); i++) {
                String sql = sqlStrings.get(i);
                ParamSetter setter = paramSetters.get(i);

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    setter.set(stmt);
                    stmt.executeUpdate();

                    try (ResultSet rs = stmt.getGeneratedKeys()) {
                        while (rs.next()) {
                            generatedKeys.add(rs.getInt(1));
                        }
                    }
                }
            }
        }

        return generatedKeys;
    }

    public Integer InsertWithKey(String sql, ParamSetter paramSetter) throws SQLException {
        PreparedStatement ps = null;
        ResultSet generatedKeys = null;
        try (Connection conn = dataSource.getConnection()) {
            ps = conn.prepareStatement(sql);
            paramSetter.set(ps);
            generatedKeys = ps.executeQuery();

            if (generatedKeys.next()) {
                return generatedKeys.getInt(1);
            }

            throw new SQLException("No key was generated on insert.");

        } finally {
            this.close(ps, generatedKeys);
        }
    }

    public <T> List<T> Query(
            String sql,
            ParamSetter paramSetter,
            RowMapper<T> rowMapper) throws SQLException {
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<T> results = new ArrayList<T>();
        try (Connection conn = dataSource.getConnection()) {
            ps = conn.prepareStatement(sql);
            if (paramSetter != null) {
                paramSetter.set(ps);
            }
            rs = ps.executeQuery();
            while (rs.next()) {
                results.add(rowMapper.map(rs));
            }

            return results;
        } finally {
            this.close(ps, rs);
        }
    }

    private void close(PreparedStatement ps, ResultSet rs) throws SQLException {
        if (ps != null) {
            ps.close();
        }

        if (rs != null) {
            rs.close();
        }
    }
}
