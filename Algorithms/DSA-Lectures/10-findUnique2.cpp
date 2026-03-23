#include<iostream>
using namespace std;

int unique(int arr[], int size){
    int ans=0;
    for(int i=0; i<size; i++){
        ans=ans^arr[i];
    }
    return ans;

}

int main()
{
    int array[7]={2, 1, 1 ,6 , 3, 6, 2};
    cout<<"Unique Element is: "<<unique(array, 7);
}