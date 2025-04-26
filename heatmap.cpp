#include <iostream>
#include <vector>
#include <cmath>
#include <fstream>

struct Point {
    double x, y;
};

// Simple 2D histogram binning
void computeDensity(const std::vector<Point>& data,
                    int x_bins, int y_bins,
                    double x_min, double x_max,
                    double y_min, double y_max,
                    std::vector<std::vector<int>>& density) {

    density.resize(x_bins, std::vector<int>(y_bins, 0));

    for (const auto& p : data) {
        int x_idx = (int)((p.x - x_min) / (x_max - x_min) * x_bins);
        int y_idx = (int)((p.y - y_min) / (y_max - y_min) * y_bins);

        if (x_idx >= 0 && x_idx < x_bins && y_idx >= 0 && y_idx < y_bins) {
            density[x_idx][y_idx]++;
        }
    }
}

void outputDensityCSV(const std::vector<std::vector<int>>& density, const std::string& filename) {
    std::ofstream out(filename);
    for (const auto& row : density) {
        for (size_t i = 0; i < row.size(); ++i) {
            out << row[i];
            if (i < row.size() - 1) out << ",";
        }
        out << "\n";
    }
    out.close();
}

int main() {
    // Example data
    // Will have to grab data from crime map in the future
    std::vector<Point> scatterData = {
        {1.0, 2.0},
        {1.1, 2.1},
        {3.5, 4.5},
        {5.0, 2.2},
        {1.2, 2.2},
        {1.0, 1.0},
        {1.0, 2.0},
        {1.0, 2.0},
        {2.0, 1.0},
        {2.0, 1.0},
        {3.0, 1.0}
    };

    // Bins vars affects how large the heatmap will be
    // The larger the bins, the more detailed the heatmap
    int x_bins = 7, y_bins = 7;
    // Min & max vars are how large the grid that we're grabbing data from is
    double x_min = 0.0, x_max = 6.0;
    double y_min = 0.0, y_max = 6.0;

    std::vector<std::vector<int>> density;
    computeDensity(scatterData, x_bins, y_bins, x_min, x_max, y_min, y_max, density);
    std::string csv_name = "heatmap_int_grid.csv";

    // Produced heatmap goes to a .csv file which is a grid of ints
    // Gonna need to convert the heatmap grid into a colored heatmap when making the map ui
    outputDensityCSV(density, csv_name);

    std::cout << "Density plot saved to " + csv_name + "\n";
    return 0;
}
