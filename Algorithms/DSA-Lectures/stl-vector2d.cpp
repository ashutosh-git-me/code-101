#include<iostream>
#include<vector>
using namespace std;

int main()
{
    //2d VECTOR
    vector<vector<int> > arr(5, vector<int> (4,0));
    //2d array created
    //5 rows
    //4 columns
    //init value of each cell is 0

    int totalRow=arr.size();
    int totalColumn=arr[0].size();

    //Jaggered Array
    vector<vector<int>> brr(4);
    brr[0]=vector<int>(4);
    brr[1]=vector<int>(2);
    brr[2]=vector<int>(5);
    brr[3]=vector<int>(3);

    int totalRow=brr.size();
    //int totalColumn=brr[n].size();


    return 0;
}